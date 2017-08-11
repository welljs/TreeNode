/**
 * Created by vorobioff on 22.06.17.
 */
import {generateGuid} from 'utils/helpers';
import MVC from 'react-redux-mvc';

export interface ITreeNodeState<D extends object, N extends TreeNode<D>> {
  id: string;
  data: D;
  children: Array<ITreeNodeState<D, N>>;
}

export class TreeNode <D extends object> {
  public data: D;
  public children: ChildrenCollection<D, TreeNode<D>>;
  public id: string;

  constructor(data: MVC.TState<D>) {
    this.id = generateGuid();
    this.data = data;
    this.children = new ChildrenCollection();
    return this;
  }

  public addChild(model) {
    this.children.add(model);
  }

  public hasChild(node: TreeNode<D>): boolean {
    return !!this.children.find(node.id);
  }

  public getState(): ITreeNodeState<D, TreeNode<D>> {
    const {id, data, children} = this;
    return {
      id,
      data,
      children: children.getState()
    };
  }
}

export class ChildrenCollection<D extends object, N extends TreeNode<D>> {
  private models: N[];

  constructor(models: N[] = []) {
    this.models = models;
  }

  public add(model: N): N {
    this.models.push(model);
    return model;
  }

  public getState(): Array<ITreeNodeState<D, N>> {
    return this.models.reduce((res: Array<ITreeNodeState<D, N>>, node: TreeNode<D>) => {
      res.push(node.getState());
      return res;
    }, []);
  }

  public find(id: string): N | undefined {
    return this.models.find((node: N): boolean => node && node.id === id);
  }
}
